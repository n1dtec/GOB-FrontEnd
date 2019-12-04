import * as React from "react";
import { Chart } from "react-google-charts";

const OxygenGauge = ({oxygen}) => {
    return (
        <Chart
            width={500}
            height={150}
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
                [ 'Label', 'Value' ],
                [ "", oxygen ]
            ]}
            options={{
                redFrom: 60,
                redTo: 90,
                redColor: "rgba(113,69,138,0.57)",
                yellowFrom: 90,
                yellowTo: 96,
                yellowColor: "rgba(72,59,82,0.57)",
                backgroundColor: "rgba(76,82,16,0.57)",
                minorTicks: 5,
                min: 60,
                max: 100,
                is3D: true
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    );
};
export default OxygenGauge;