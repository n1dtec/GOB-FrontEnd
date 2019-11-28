import * as React from "react";
import { Chart } from "react-google-charts";

const TemperateGauge = ({temperature}) => {
    return (
        <Chart
            width={400}
            height={120}
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
                [ 'Label', 'Value' ],
                [ "Temperature", temperature ]
            ]}
            options={{
                redFrom: 90,
                redTo: 100,
                redColor: "rgba(113,69,138,0.57)",
                yellowFrom: 75,
                yellowTo: 90,
                yellowColor: "rgba(72,59,82,0.57)",
                backgroundColor: "rgba(76,82,16,0.57)",
                minorTicks: 5,
                is3D: true
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    );
};
export default TemperateGauge;