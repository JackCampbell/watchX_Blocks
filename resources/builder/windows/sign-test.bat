New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=DEDB152F-6BF9-42A7-87C0-453E485DD86E" -KeyUsage DigitalSignature -FriendlyName "Your friendly name goes here" -CertStoreLocation "Cert:\CurrentUser\My" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")
$password = ConvertTo-SecureString -String jc -Force -AsPlainText
Export-PfxCertificate -cert "Cert:\CurrentUser\My\67F4AFFD19B57B1913C72E1118BE68F229595D5E" -FilePath C:\Users\JackCampbell\Desktop\watchX_Blocks\dist\cert.pfx -Password $password

# pvk2pfx -pvk cert.pvk -pi jc -spc cert.spc -pfx cert.pfx -f

SignTool sign /f cert.pfx /p 'jc' "watchX Blocks 1.0.1541.appx"

MakeCert.exe -r -h 0 -n "CN=DEDB152F-6BF9-42A7-87C0-453E485DD86E" -eku 1.3.6.1.5.5.7.3.3 -pe -sv wxb.pvk wxb.cer
pvk2pfx.exe -pvk wxb.pvk -spc wxb.cer -pfx wxb.pfx
signtool.exe sign -f wxb.pfx -fd SHA256 -v '.\watchX Blocks 1.0.1541.appx'
