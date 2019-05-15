#!/bin/sh
buildSources()
{
    echo "start build sources"
    yarn
    yarn build
    cd ..
    rm -rf ../public/*
    mv offerbrite-recovery/build/* ../public
}
echo "start build frontend"
mkdir frontend
mkdir public
cd frontend
mkdir offerbrite-recovery   # if you want to check file use touch instead of mkdir
ret=$?
if [ "$ret" == "1" ]
then
    echo "dir present, check, should it pull changes from master"
    cd offerbrite-recovery
    git checkout master
    UPSTREAM='master'
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse "$UPSTREAM"@{upstream})
    BASE=$(git merge-base @ "$UPSTREAM"@{upstream})

    if [ $LOCAL != $REMOTE ]; then
        echo "Need to pull"
        git pull origin master
        buildSources
    fi
else
    echo "dir not present, clone repo"
    git clone git@gitlab.com:fulcrumy/offerbrite-recovery.git
    cd offerbrite-recovery
    git checkout master
    buildSources
fi
