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
tar --exclude=node_modules/ --exclude=test/ --exclude=output/ --exclude=deploy.sh -zcvf $tarFileName ./*


if [[ $hostName =~ "155.199" ]];then
    targetDir=/root/ft_local
else
    targetDir=/root/guowangyang/ft_local
fi

expect -c "
        set timeout 1200;
        spawn scp -P 36000 -r $tarFileName root@$hostName:$targetDir
        expect {
                \"*yes/no*\" {send \"yes\r\"; exp_continue}
                \"*password*\" {send \"$hostPwd\r\";}
               }
expect eof;"

