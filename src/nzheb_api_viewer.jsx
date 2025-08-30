import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import YAML from "yaml";

// Import the YAML file as a raw string
import openApiYaml from "!!raw-loader!./nzheb-openapi.yaml";

const NZHEBApiContract = () => {
  // Parse the YAML string into a JavaScript object
  const openApiSpec = YAML.parse(openApiYaml);

  return (
    <div className="swagger-container">
      <SwaggerUI spec={openApiSpec} />
    </div>
  );
};

export default NZHEBApiContract;