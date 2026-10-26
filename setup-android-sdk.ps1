# Installs the Android SDK pieces this project needs (compileSdk 36) without the Studio wizard.
$ErrorActionPreference = 'Stop'

$sdk  = "$env:LOCALAPPDATA\Android\Sdk"
$zip  = "$env:TEMP\cmdline-tools.zip"
$url  = 'https://dl.google.com/android/repository/commandlinetools-win-15859902_latest.zip'

# Use the Temurin JDK 21 we installed for sdkmanager
$javaHome = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot'
if (Test-Path $javaHome) { $env:JAVA_HOME = $javaHome }

Write-Host '== downloading command-line tools =='
Invoke-WebRequest -Uri $url -OutFile $zip

Write-Host '== extracting =='
$tmp = "$env:TEMP\cmdline-extract"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
Expand-Archive -Path $zip -DestinationPath $tmp -Force
New-Item -ItemType Directory -Path "$sdk\cmdline-tools" -Force | Out-Null
if (Test-Path "$sdk\cmdline-tools\latest") { Remove-Item "$sdk\cmdline-tools\latest" -Recurse -Force }
Move-Item -Path "$tmp\cmdline-tools" -Destination "$sdk\cmdline-tools\latest" -Force

$sdkmanager = "$sdk\cmdline-tools\latest\bin\sdkmanager.bat"

Write-Host '== accepting licenses =='
$yes = (1..100 | ForEach-Object { 'y' }) -join "`n"
$yes | & $sdkmanager --licenses --sdk_root=$sdk

Write-Host '== installing platform-tools, android-36, build-tools =='
& $sdkmanager --sdk_root=$sdk 'platform-tools' 'platforms;android-36' 'build-tools;36.0.0'

Write-Host "== local.properties =="
Set-Content -Path "$PSScriptRoot\android\local.properties" -Value "sdk.dir=$($sdk -replace '\\','/')"

Write-Host 'SDK SETUP COMPLETE'
