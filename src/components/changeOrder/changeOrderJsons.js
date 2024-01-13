const json = {
  externalId: "206443856",
  requestId: "YyqSK8D/R/KHh7Aadc1tfw==",
  description: "Modify Bandwidth for IP Access",
  requestedCompletionDate: "2025-01-12T18:30:00.000Z",
  orderItem: [
    {
      id: "1",
      action: "modify",
      service: {
        id: "711859002",
        serviceCharacteristic: [
          {
            name: "serviceBandwidthUp",
            value: [100000],
            valueType: "number",
          },
          {
            name: "serviceBandwidthDown",
            value: [100000],
            valueType: "number",
          },
          {
            name: "minimumBandwidthDown",
            value: [75000],
            valueType: "number",
          },
          {
            name: "minimumBandwidthUp",
            value: [75000],
            valueType: "number",
          },
          {
            name: "promisedBandwidthUp",
            value: [100000],
            valueType: "number",
          },
          {
            name: "promisedBandwidthDown",
            value: [100000],
            valueType: "number",
          },
          {
            name: "sla",
            value: ["Standard"],
            valueType: "string",
          },
        ],
        serviceSpecification: {
          id: "CFS_IP_ACCESS_GOP_FTTH",
          name: "CFS_IP_ACCESS_GOP_FTTH",
          version: "1.0",
        },
      },
    },
  ],
  relatedParty: [
    {
      id: "0015r00000vR4hpAAC",
      role: "Customer",
      name: "Wesley B V",
    },
    {
      id: "BSS-Simulator",
      role: "Requester",
      name: "BSS Simulator Integration Environment",
    },
  ],
};

export { json };
