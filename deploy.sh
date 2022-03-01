#!/bin/sh
set -eux

hostName=
hostPwd=
project=watch-auto-deploy
tarFileName=


function getTarName() {
  tarFileName=${project}.tar.gz
}


function getEnvInfo() {
  eval $2=$(awk -F '=' '$1 == "'$1'"  {print $NF}' \.env\.local)
}

function getHostInfo() {
  getEnvInfo HOST_NAME hostName
  getEnvInfo HOST_PWD hostPwd

  echo $hostName
  echo $hostPwd
}

function getTargtDir() {
  if [[ $hostName =~ "155.199" ]];then
    targetDir=/root/ft_local
  else
    targetDir=/root/guowangyang/ft_local
  fi
}

function zipFile() {
  rm -rf ./$tarFileName
  tar --exclude=node_modules/ --exclude=test/ --exclude=output/ --exclude=deploy.sh -zcvf $tarFileName ./*
}

function uploadFile() {
  expect -c "
    set timeout 1200;
    spawn scp -P 36000 -r $tarFileName root@$hostName:$targetDir
    expect {
            \"*yes/no*\" {send \"yes\r\"; exp_continue}
            \"*password*\" {send \"$hostPwd\r\";}
            }
  expect eof;"
}

function main() {
  getTarName
  getHostInfo
  getTargtDir
  zipFile
  uploadFile
}

main

