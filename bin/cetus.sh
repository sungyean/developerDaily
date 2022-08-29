#!/bin/sh

JAR_NAME=kware_cetus_v1-1.0-dev.jar
PID_FILE=.k_cetus.pid
LOG_PATH=../logs/cetus.log

cd  ~keti/dev/cetus/bin

CURRENT_PID=`cat $PID_FILE`
	 if [ -z $CURRENT_PID ]; then
                CURRENT_PID=-1
        fi

         case "$1" in
         'start')
		if [ -d "/proc/${CURRENT_PID}" ]; then
			echo " Application runing ..."
			return;
		else
                	#nohup java -jar -Dspring.profiles.active=dev -Dserver.port=48080 -Duser.timezone=KST $JAR_NAME > $LOG_PATH 2>&1&
			nohup java -jar -Dspring.profiles.active=dev -Duser.timezone=KST ../libs/$JAR_NAME > /dev/null 2>&1&
                	echo $! > ./$PID_FILE
			tail -f $LOG_PATH
		fi
                 ;;
         'stop')
		if [ -d "/proc/${CURRENT_PID}" ]; then
			echo "shutdown is in progress.";
			kill -15  $CURRENT_PID
			sleep 3
			echo "Exit process!!";
		else
			echo "Not running";
			return;
		fi		
		if [ -d "/proc/${CURRENT_PID}" ]; then
			kill -9 $CURRENT_PID
		fi
                ;;
        *)
                echo "Usage: $0 { start | stop }"
                ;;
        esac

# End of Script
