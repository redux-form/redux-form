#!/bin/bash
rebuild=false
while test $# -gt 0; do
  case "$1" in
    --rebuild)
      rebuild=true
      shift
      ;;
    *)
      break
      ;;
  esac
done

if $rebuild
then
  echo 'Rebuilding'
fi

cd examples
for example in `ls -d */`
do
  echo $example
  cd $example
  if $rebuild
  then
    rm -rf node_modules
  else
    rm -rf node_modules/redux-form
    rm -rf node_modules/redux-form-website-template
  fi
  yarn
  cd ..
done
tput bel
say "The examples are built"
