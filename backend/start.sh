#!/bin/bash

pkill -f 'java -jar' || echo "Nothing to kill."
sleep 1
nohup java -jar /home/ec2-user/dailysync/backend/target/DailySync-0.0.1-SNAPSHOT.jar > /home/ec2-user/app.log 2>&1 &
echo "App started."
