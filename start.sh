#!/bin/bash
# File: backend/start.sh

# Kill any existing app
pkill -f 'java -jar' || echo "Nothing to kill."

# Wait
sleep 1

# Start app in background
nohup java -jar /home/ec2-user/dailysync/app.jar > /home/ec2-user/app.log 2>&1 &
echo "App started."
