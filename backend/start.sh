#!/bin/bash

pkill -f 'java -jar' || echo "Nothing to kill."
sleep 1
nohup java -jar /home/ec2-user/dailysync/app.jar > /home/ec2-user/app.log 2>&1 &
echo "App started."
