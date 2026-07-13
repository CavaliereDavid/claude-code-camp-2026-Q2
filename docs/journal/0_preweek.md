# Preweek Technical Documentation

## Technical Goal

- [ ] Build an agent with an sdk and after understanding how to implement it try to build my own agent without using one.
- [ ] I want to experiment MUD by using my phone, by using Haven app (f-droid) create a connection and play the game
- [ ] Next step is to use openclaw to use the game
## Technical Uncertainty

My own ability to implement it. Doing it with AI is easy but I want to make the most and delegate where I can.
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

## Technical Conclusions


## Key Takeaway