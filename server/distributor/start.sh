#!/bin/bash

forever start -l forever.log -o out.log -e err.log AIS_distributor.js
