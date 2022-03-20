#bash

helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm upgrade --install -n monitoring loki grafana/loki-stack -f ./promop-values.yaml
