---
title: How computer memory ACTUALLY works
description: Virtual address space, paging, the stack and the heap.
date: 2025-09-25
---

## How memory is usually taught

Most universities, schools and online courses usually separate memory into 2 places:

- The stack, where all your local variables live.
- The heap, the magical place where you go get memory if you don't know the size ahead of time.

This is a bit inaccurate, the CPU doesn't really differentiate between the stack and the heap[^1],
For the CPU, it's all just a bunch of memory.

## Virtual Memory

In the past, programs would use physical addresses to refer to a specific place in the computer's RAM.
nowadays this is no longer the case, because of several issues:

- Insecure - malicious programs can read or write into another program's memory which may contain passwords or other secrets.
- Bug prone - a program may accidentally read or write into arbitrary places, causing the entire system to crash
  or misbehave, rather than just the program itself.
- RAM-limited - the maximum memory limit is how much RAM the computer has, saving and
  restoring memory from disk is not possible.

The way modern CPUs and operating systems solve this problem is by assigning every process (program)
it's own "virtual address space" and then map virtual addresses into physical addresses.

- Fixes security - each process has it's own address space, and can't access the other address spaces.
- Fixes bugs - the process is self-contained, crashing doesn't effect other processes.
- Fixes memory limits - the operating system can intervene and swap memory in and out of disk
  to emulate more RAM (at the cost of lower speeds).

So how does this work?

On 64-bit operating systems, pointers (addresses) are stored as 64-bit numbers, this allows for
2^64 addreses, which is excessive, in reality, CPUs only use 48 of those bits[^2] to store the address,
this means the virtual address space is 256TB in size.

```
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            ignored            |            48-bit virtual address                                                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

Of course, most computers don't have 256TB of physical memory[^2], for example, I only have 64GB.

The reason this works is **virtual memory may not have physical memory backing it**, and keeping
track of virtual memory is essentially free.
You are not storing 256TB of data, you only need to keep track of ranges of virtual addresses and
their mapping to the physical addresses that back them up.

For performance reasons, the mappings don't store ranges of individual bytes of memory, but rather
chunks, usually 4k bytes, this is known as a "page".

The operating system sets up a "page table" for each process which maps virtual pages in the process
virtual address space into physical pages in the computer's RAM.

This is enabled by hardware support. CPUs understand what a "page table" is, and have a special
register that points to a page table, the operating system then makes sure to set that register
to the correct page table for the currently running process.

Each entry in the page table has some additional metadata such as:

- Read access bit - whether the process is allowed to read from the page.
- Write access bit - whether the process is allowed to write to the page.
- Execute access bit - whether the process can execute code that is inside the page.

We will see why that's useful soon.

## Using Virtual Memory

Operating systems provide through syscalls 4 main operations for dealing with virtual memory:

### Reserve

You ask the operating system to reserve a certain amount of virtual address (must be a multiply of
the page size), and it gives you back a pointer to the first address.

Reserving only guarantees that if you ask again, it won't give you that same range of addresses,
but it does not yet ask for physical memory so this operation is essentially free.

Trying to access reserved pages will result in a page fault causing the operating system to
terminate the proggram with a segmentation fault (segfault).

### Commit

Similar to reserve, but now you are asking the operating system to back up the virtual pages you asked for with physical pages.  
You are allowed to commit pages that you have previously reserved.

The operating system may not back the pages yet with physical pages, but mark the page as "no access",
as in read, write and execute bits all set to 0.

Trying to access the pages, triggers a page fault, waking up the OS, which checks if the page was commited,
and if it was, instead of crashing the program, it'd back up the virtual page with a physical page
(potentially swapping a page from disk), and then resuming the program.

From the program's perspective, everything looks normal except the performance hit due
to the added delay, which can be measured.

### De-commit

De-commit releases the physical memory backing the page up, and changes the virtual page to being reserved.

### Release

Release releases physical memory of the page AND un-reserves it from the virtual address space.

## What is the stack VS the heap then?

So, if the operating system only deals with pages and virtual memory, then why do people
differentiate memory into "the stack" and "the heap"?

### The stack

The stack is a region where functions[^3] store their local variables, but it's just
memory, the compiler specifies the wanted stack size in the executable format (usually 2MB),
and the OS reserves it in the virtual address space when it creates the process.

The heap on the other hand, is a higher-level interface that operating systems usually provide.  
it's a way to allow many big or small allocations, to be as efficient as possible.  
To achieve this, it uses techniques like freelists to chunk many pages into fine-grained allocations.

### Allocators

Things like `malloc` and `free` are examples of heap allocators.

In almost all cases, you don't need such a generic allocator like malloc, and instead, other allocators
such as arenas and pools cover most use cases.

Arenas are stack allocators, they have a base pointer and a size, and they can push new elements,
pop the last element, or release the entire thing at once (by resetting to 0).

Use cases for arenas include in games or apps, a frame-arena that you reset at the start of a frame,
or in web servers a per-request arena that resets when a response is served.

A pool is an arena that stores fixed-size elements, this restriction enables the ability to reuse
elements that have been freed anywhere, not just the top of the stack like a normal arena.

Use cases for pools are for example in games, a pool for enemies, defeating an enmey and then
spawning a new one, reuses the space left by the defeated enemy.

For more information on memory management techniques, see [my curated list of resources for managing memory](https://git.kyren.codes/Kyren223/resources#how-to-actually-manage-memory-its-easy).

## A cool trick that virtual memory enables

### Growing a Dynamic array / Vector / List without resizing

The way most languages implement dynamic arrays (like C++, Rust, Go) force a limitation on the programmer:
pointers are not stable.

This means that if you take a reference to an element in the dynamic array, and then add an element to it,
the reference may no longer be valid.

This is due to the case where you add an element, if there is not enough space in the array,
it may need to resize it, by creating a new (larger) array, copying all the elements, and then
returning the new larger array, so of course retaining a reference to the elements isn't valid.

This annoying restriction can be lifted entirely by using the knowledge we learned about how
the virtual address space works.

Because the address space is so large (256TB), we can reserve an excessively large chunk, say 64GB
of it, but only commit a single page, then whenever we need to grow, we just commit more pages.

Of course, 64GB is quite large and takes a decent chunk out of those 256TB, but the point was to
show it's possible. In practice, you will most likely have some upper bound for how much you are
expecting to be the maximum, for example in my own codebase, I usually only reserve 64MB.

This works because from the perspective of your program, addresses are contiguous due to using
virtual memory. The physical pages in RAM that back the virtual memory are basically always
scattered and fragmented anyways.

## End

As always if you have questions or want to chat, feel free to contact me on discord at Kyren223 or email me at contact@kyren.codes.

[^1]:
    CPUs have 2 registers usually called sp (stack pointer) and bp (base pointer) for
    storing the lower and upper bounds of the currently active stack.
    They are used in instructions like push and pop.

[^2]: Some super computers exceeded the 256TB limit, so certain CPUs support 52-bit or 56-bit addresses

[^3]:
    Procedures is the more correct term, function implies "pure function" with no side effects (like in math),
    while procedures may or may not have side effects.
