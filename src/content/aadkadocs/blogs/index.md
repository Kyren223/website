---
title: The search for the perfect ed25519 key pair
template: splash
---

Todo write intro to catch attention

### Why care about ed25519 key pairs?

Ed25519 is a cryptographic algorithm for generating
a pair of keys, a public one that can be shared with anyone
and a private one that is kept as a secret.

### The ssh public key format

If you have ever accessed a remote server it was most likely by
ssh-ing into it.  
You have also most likely had to copy paste something similar to this:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBSSj+yfJLWEb+Df4r4603TOFAUBREYS43qQB+c9i9UW
```

Let's break it down

- The first part `ssh-ed25519` is the algorithm type, other common algorithms are `ssh-rsa` and `ssh-ecdsa`
- The second part is a base64-encoded binary format consiting of
  - the length of the algorithm string, for ed25519 it's always 11 (4 bytes long)
  - the algorithm type, for ed25519 it's always `ssh-ed25519` in binary (11 bytes long)
  - the length of the key, 32 bytes for ed25519 (4 bytes long)
  - the actual ed25519 key (32 bytes long)

### Embedding a word in base64

Base64 is a widely used format for writing binary in a compact and human readable way,
it uses A-Z, a-z, 0-9, '/' and '+' adding up to 64 unique characters.

It's possible to choose specific bytes in a way that when encoding it with base64
it will form a word.

For example, to encode "Kyren" in base64, we can use the following bytes  
`00101011 00101010 01001110` or in hex `2b 2a de`
