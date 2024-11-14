---
title: The search for the perfect SSH key
description: Here's how you can embed your name in an SSH key
date: 2024-11-14
---

# The search for the perfect SSH key

SSH keys are widely used among developers,
they are the equivalent of a username and password in the development world.
They enable you to prove you are who you claim to be and they are the gateway
into accessing servers remotely in a secure manner.

### The ssh public key format

When generating an ssh key, you get 2 files, one with no extension that stores the private key
and another that ends with a `.pub`.
The public key is what you share publicly on your profile or add to a remote server to login through SSH.

Here's how a typical SSH public key looks

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBSSj+yfJLWEb+Df4r4603TOFAUBREYS43qQB+c9i9UW
```

Let's break it down

- The first part `ssh-ed25519` is the algorithm type that was used, other common algorithms are `ssh-rsa` and `ssh-ecdsa`
- The second part is a base64-encoded binary format consiting of the following
  - the length of the algorithm string, for ed25519 it's always 11 (4 bytes long)
  - the algorithm type, for ed25519 it's always `ssh-ed25519` in binary (11 bytes long)
  - the length of the key, 32 bytes for ed25519 (4 bytes long)
  - the raw bytes for the ed25519 key (32 bytes long)

### Embedding a word in base64

Base64 is a widely used format for displaying binary in a compact and human readable way,
it uses A-Z, a-z, 0-9, '/' and '+' adding up to 64 unique characters.

It's possible to choose specific bytes in a way that when encoding it with base64
it will form a word.

For example, to encode "Kyren" in base64, we can use the following bytes  
`00101011 00101010 01001110` or in hex `2b 2a de`

So by controlling the 32 bytes at the end of the ssh we are able to get
a ssh public key containig any keyword we want.

## Brute Force

Unfortunately this won't work, we still want to be able to use the key
so we will need to know the corresponding private key, but it's impossible to reverse engineer
the private key using the public one, that's why cryptography is sosecure.

The solution is to just generate a bunch of keys until we get lucky and find the desired keyword.
So that's exactly what I have done, here's a basic go program that does that.

```go
package main

import (
	"bytes"
	"crypto/ed25519"
	"encoding/base64"
	"fmt"

	"golang.org/x/crypto/ssh"
)

func main() {
	keyword := []byte("Kyren")
	for {
		pubKey, privKey, _ := ed25519.GenerateKey(nil)
		sshPubKey, _ := ssh.NewPublicKey(pubKey)
		pub := ssh.MarshalAuthorizedKey(sshPubKey)
		if bytes.Contains(pub, keyword) {
			privBase64 := base64.StdEncoding.EncodeToString(privKey)
			fmt.Printf("Found %s in %s with private key %s\n", string(keyword), string(pub), privBase64)
			break
		}
	}
}
```

I have later improved this program by adding multithreading and made it easier to use.
The final code can be seen on my GitHub [in this link](https://github.com/Kyren223/ed25519-key-gen).

## Results

After running it for 2 days (about 24 hours in total) on my laptop with a AMD Ryzen 5 7530U (12 threads),
here are the results:

```
Completed Search
Time Elapsed: 12h9m11.225248108s
Searched: 6733606724 Found: 737
```

- Generated and searched 150k SSH keys per second
- Found a 5-character keyword every 9.1 million keys or about 1 every minute
- Found a 6 character keywords every 1/64 of every 5-character keyword, or about 1 every hour
- Found 5-character that are at the end of the SSH key 1/50 of every 5-character keyword

My goal was to find either a `/kyren` or `+kyren` at the end of the key,
on average that'd be 1/3200 5-character keywords.
At the end after only 1862 5-char keywords I found 3 keys that matched what I was looking for:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFjS3Pl+DZKyyoAl+ZN0FDsxyOWzLgNQo+YaYe+KYREN
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO7P9K9D5RkBk+JCRRS6AtHuTAc6cRpXfRfRMg/Kyren
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKEKL6f7j8U70si1YGPBUhIcsHtJIUeH+uiUlS+kyren
```

I will be going with the middle one as my permanent SSH key.

I hope this inspires you to try and find your own SSH key,
hopefully your name is not 7 characters long,
and if it's 8, I hope you have 170 years to spare.

Thanks for reading! this is my first blog post so any feedback will be appreciated!
