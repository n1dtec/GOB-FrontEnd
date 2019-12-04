import * as React from "react";
import { Chart } from "react-google-charts";

const HumidityGauge = ({humidity}) => {
    return (
        <Chart
            width={500}
            height={150}
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
                [ 'Label', 'Value' ],
                [ "", humidity ]
            ]}
            options={{
                redFrom: 50,
                redTo: 60,
                redColor: "rgba(113,69,138,0.57)",
                yellowFrom: 45,
                yellowTo: 50,
                yellowColor: "rgba(72,59,82,0.57)",
                backgroundColor: "rgba(76,82,16,0.57)",
                minorTicks: 5,
                min: 20,
                max: 60,
                is3D: true
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    );
};
export default HumidityGauge;