#!/bin/sh
set -eux

function getHostInfo() {
  eval $1=$(awk -F '=' '$1 == "'$1'"  {print $NF}' server.pwd)
}

fileName=watch-auto-deploy
tarFileName=${fileName}.tar.gz

getHostInfo hostName
getHostInfo hostPwd


rm -rf ./$tarFileName
tar --exclude=node_modules/ --exclude=test/ --exclude=output/ --exclude=build.sh -zcvf $tarFileName ./*


expect -c "
        set timeout 1200;
        spawn scp -P 36000 -r $tarFileName root@$hostName:/root/ft_local
        expect {
                \"*yes/no*\" {send \"yes\r\"; exp_continue}
                \"*password*\" {send \"$hostPwd\r\";}
               }
expect eof;"

