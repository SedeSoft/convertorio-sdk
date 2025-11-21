@echo off
cd /d %~dp0
ruby -I../../libs/ruby/lib -Ispec -rbundler/setup -rrspec/autorun spec/convertorio_spec.rb
