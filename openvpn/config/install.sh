
curl https://releases.rancher.com/install-docker/19.03.sh | sudo bash -

systemctl enable docker

systemctl start docker


docker pull webterminal/webterminal

docker run -dti --restart always -p 8181:80 -p 2100:2100 webterminal/webterminal


export OVPN_DATA="ovpn-data-mgmt"

docker volume create --name $OVPN_DATA

docker run -v $OVPN_DATA:/etc/openvpn --log-driver=none --rm kylemanna/openvpn ovpn_genconfig -u udp://0.0.0.0

docker run -v $OVPN_DATA:/etc/openvpn --rm kylemanna/openvpn touch /etc/openvpn/vars

echo "${organization}" | docker run -v $OVPN_DATA:/etc/openvpn --log-driver=none --rm -i kylemanna/openvpn ovpn_initpki nopass

echo "Inciando container openvpn"
docker run --restart always -v $OVPN_DATA:/etc/openvpn -d -p 1194:1194/udp --cap-add=NET_ADMIN kylemanna/openvpn

echo "Gerando certificado client"
docker run -v $OVPN_DATA:/etc/openvpn --log-driver=none --rm -i kylemanna/openvpn easyrsa build-client-full ${organization}client nopass

echo "Exportando certificado client"
docker run -v $OVPN_DATA:/etc/openvpn --log-driver=none --rm kylemanna/openvpn ovpn_getclient ${organization}client > /root/${organization}client.ovpn

echo "Baixando azure cli"
curl -sL https://aka.ms/InstallAzureCLIDeb |  bash
curl -sL https://aka.ms/InstallAzureCLIDeb |  bash

export AZURE_STORAGE_ACCOUNT="${stg_name}"

export AZURE_STORAGE_KEY="${stg_key}"

echo "Upload client config para storage account"
az storage blob upload --container-name openvpn --name ${organization}client.ovpn --file /root/${organization}client.ovpn
