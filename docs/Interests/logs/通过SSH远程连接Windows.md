## 安装OpenSSH server

*Windows PowerShell(管理员)(A)*

在powershell中输入：

```text
# 安装OpenSSH客户端
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

#安装OpenSSH服务端
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

在powershell中输入：

```text
Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'
```

若返回为：

```text
Name  : OpenSSH.Client~~~~0.0.1.0
State : Installed

Name  : OpenSSH.Server~~~~0.0.1.0
State : Installed
```

则表示安装成功

## 公钥

储存在`C:\Users\username\.ssh\authorized_keys`

注意要修改权限😭

```
# 远程通过ACL更改文件权限
ssh --% user1@ip icacls.exe "C:\Users\username\.ssh\authorized_keys" /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"

#在服务器端修改authorized_keys文件权限
icacls.exe "C:\Users\username\.ssh\authorized_keys" /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

## 修改配置

需要管理员权限

`C:\ProgramData\ssh\sshd_config`

参考

```
# This is the sshd server system-wide configuration file.  See
# sshd_config(5) for more information.

# The strategy used for options in the default sshd_config shipped with
# OpenSSH is to specify options with their default value where
# possible, but leave them commented.  Uncommented options override the
# default value.

#Port 22
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::

#HostKey __PROGRAMDATA__/ssh/ssh_host_rsa_key
#HostKey __PROGRAMDATA__/ssh/ssh_host_dsa_key
#HostKey __PROGRAMDATA__/ssh/ssh_host_ecdsa_key
#HostKey __PROGRAMDATA__/ssh/ssh_host_ed25519_key

# Ciphers and keying
#RekeyLimit default none

# Logging
#SyslogFacility AUTH
#LogLevel INFO

# Authentication:

#LoginGraceTime 2m
#PermitRootLogin prohibit-password
#StrictModes yes
#MaxAuthTries 6
#MaxSessions 10

PubkeyAuthentication yes

# The default is to check both .ssh/authorized_keys and .ssh/authorized_keys2
# but this is overridden so installations will only check .ssh/authorized_keys
AuthorizedKeysFile  .ssh/authorized_keys

#AuthorizedPrincipalsFile none

# For this to work you will also need host keys in %programData%/ssh/ssh_known_hosts
#HostbasedAuthentication no
# Change to yes if you don't trust ~/.ssh/known_hosts for
# HostbasedAuthentication
#IgnoreUserKnownHosts no
# Don't read the user's ~/.rhosts and ~/.shosts files
#IgnoreRhosts yes

# To disable tunneled clear text passwords, change to no here!
PasswordAuthentication no
#PermitEmptyPasswords no

# GSSAPI options
#GSSAPIAuthentication no

#AllowAgentForwarding yes
#AllowTcpForwarding yes
#GatewayPorts no
#PermitTTY yes
#PrintMotd yes
#PrintLastLog yes
#TCPKeepAlive yes
#UseLogin no
#PermitUserEnvironment no
#ClientAliveInterval 0
#ClientAliveCountMax 3
#UseDNS no
#PidFile /var/run/sshd.pid
#MaxStartups 10:30:100
#PermitTunnel no
#ChrootDirectory none
#VersionAddendum none

# no default banner path
#Banner none

# override default of no subsystems
Subsystem   sftp    sftp-server.exe

# Example of overriding settings on a per-user basis
#Match User anoncvs
#   AllowTcpForwarding no
#   PermitTTY no
#   ForceCommand cvs server

#Match Group administrators
#       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

## 启动

```text
 启动sshd服务
Start-Service sshd

# 将sshd服务设置为自动启动，若不设置需要在每次重启后重新开启sshd
Set-Service -Name sshd -StartupType 'Automatic'

# 确认防火墙规则，一般在安装时会配置好
Get-NetFirewallRule -Name *ssh*

# 若安装时未添加防火墙规则"OpenSSH-Server-In-TCP"，则通过以下命令添加
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```