#!/bin/bash

# Kill any existing Java processes running a JAR
pkill -f 'java -jar' || echo "Nothing to kill."

# Give it a second to fully shut down
sleep 1

# Move the .env file to the target directory
mv /home/ec2-user/dailysync/backend/.env /home/ec2-user/dailysync/backend/target/.env

# Start the new application in the background, redirecting logs
nohup java -jar /home/ec2-user/dailysync/backend/target/DailySync-0.0.1-SNAPSHOT.jar > /home/ec2-user/app.log 2>&1 &

echo "App started."
