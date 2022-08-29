#!/bin/bash 
PROJECT_NAME=k_cetus
ACTIVE_PROFIE=dev
PROJECT_DIR=~keti/dev/cetus


LIB_DIR=$PROJECT_DIR/libs
SRC_DIR=$PROJECT_DIR/src/trunk
LOG_DIR=$PROJECT_DIR/logs

now=$(date +'%Y%m%d_%H%M%S')

echo "------ Deploy 시작: $PROJECT_NAME ------"
echo ""

cd $SRC_DIR

echo "------ svn update ------"
echo "=======================================" >> ../deployHist.txt
echo "* 반영 시작 시각 : $(date)" >> ../deployHist.txt
echo "------ 반영전 svn정보 ------" >> ../deployHist.txt
svn info >> ../deployHist.txt

svn revert -R .
svn update

echo "------ 반영 후 svn정보 ------" >> ../deployHist.txt
svn info >> ../deployHist.txt
echo "------ svn update 완료"

echo "" 
echo "> Project build start" 
rm $SRC_DIR/build/libs/*.jar
cd $SRC_DIR

sed -i "s/'local'/'$ACTIVE_PROFIE'/g" ./src/main/resources/application.yml

./gradlew clean
./gradlew bootJar
cd $SRC_DIR

echo ""
echo "> Deploy new application" 
JAR_NAME=$(ls -tr $SRC_DIR/build/libs | grep jar | tail -n 1) 
echo "  JAR Name: $JAR_NAME" 

RENAME_JAR=${JAR_NAME//.jar/-$ACTIVE_PROFIE.jar}

echo "> Build file backup and copy" 
mv $LIB_DIR/$RENAME_JAR ${LIB_DIR}_backup/$RENAME_JAR-$now
cp $SRC_DIR/build/libs/$JAR_NAME $LIB_DIR/$RENAME_JAR

echo "--------- Deploy End!! ----------" 
echo "Result File Path: $LIB_DIR/$RENAME_JAR"
