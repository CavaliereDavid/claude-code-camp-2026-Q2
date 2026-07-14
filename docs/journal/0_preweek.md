# Preweek Technical Documentation

## Technical Goal

- [ ] Build an agent with an sdk and after understanding how to implement it try to build my own agent without using one.
- [x] I want to experiment MUD by using my phone, by using Haven app (f-droid) create a connection and play the game
  - [ ] Next step is to use openclaw to use the game
- [ ] Use open models to evaluate
  - [x] Use llama.cpp 
  - [x] Enhance open models on linux with [libopenblas-dev](https://github.com/OpenMathLib/OpenBLAS/tree/develop)
  - [ ] like FinOps define a cost usage for all coding harness even those that are using open models by following this simple model: **request** | **token usage** | **time spent** |
## Technical Uncertainty

My own ability to implement it. Doing it with AI is easy but I want to make the most and delegate where I can.
After installing llama.cpp I went to look in HuggingFace for a model that would fit my needsd for tbaMUD. Apart from most popular models like Qwen 3.6 series and Gemma 4 series, I was looking for a specific model that would cater for my needs but I was not sure what fit my needs.
## Technical Hypotheses

With the time I have, the most realistic goal I can achieve is to implement the agent using a SDK and possibly complete the primary challenge.
## Technical Observerations

1. Technical goal **Build an agent with a SDK**:
2. Technical goal **Connect using phone to tbaMUD**:

Could not connect using phone because of the firewall? 
```zsh
sudo ufw allow 4000/tcp.
```
| Still not working, probably due to router network isolation. 

### Remove rule and create an ssh tunnel

```zsh
sudo ufw delete allow 4000/tcp
sudo ufw status verbose
```

### SSH
```zsh
sudo apt install openssh-server
```

| Check installation
```zsh
sudo systemctl status ssh
```
| Inactive

Reason for inactive: on modern linux ssh is often configured to run via a systemd socket, instead of ssh.service running constantly in the background.

### Starting the ssh and service

```zsh
sudo systemctl start ssh.socket
sudo systemctl start ssh.service
```

| Verify again
```zsh
sudo systemctl status ssh
```
### Succesful connection

<img src="images/connectedToPC.jpg" alt="Connected to PC" width="300">

### Connecting to tbaMud using phone

<img src="images/ConnectedToTbaMudOnPhoneusingHaven.jpg" alt="Connected to tbaMUD on phone using Haven" height="300">


3. Technical goal **Use OpenClaw**:


4. Technical goal **Use open models to evaluate**:
I had already installed llama.cpp to evaluate some local models.

### Improve local models on linux with explanation.

- BLAS libraries improve matrix multiplication performance on CPUs
- Accelerate inference with the help of the CUDA Toolkit

5. Technical goal **Choosing the right model from HuggingFace**:
I had an hard time choosing the category that would fit my needs.
There are many categories and the one I had a look into where:
- Text generation: specializes in generating text, It could fit my needs.
- Sentennce similarity: specializes in converting sentences to vector embeddings, It could fit my needs if I am not specific about what to do.
- Zero-Shot / Text Classification: specializes in evaluating, It could be useful to generate on the fly commands for my player that do not yet exist
- Token Classification: model that parse the sentence to identify a possible target.
- Text-to-Speech(TTS): could be fun to play around and create an immersive experience.

## Technical Conclusions


## Key Takeaway