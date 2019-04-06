#!/usr/bin/env sh

######################################################################
# @author      : cromarmot (yexiaorain@gmail.com)
# @file        : update
# @created     : 星期六 4月 06, 2019 22:33:32 CST
#
# @description : 
######################################################################


npm run build && cd dist && git init && git checkout -b gh-pages && git add . && git commit -m "auto update" && git remote add origin git@github.com:CroMarmot/cfstatus.git && git push origin gh-pages -f
