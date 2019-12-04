import * as React from "react";
import { Chart } from "react-google-charts";

const HeartbeatGauge = ({heartbeat}) => {
    return (
        <Chart
            width={500}
            height={150}
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
                [ 'Label', 'Value' ],
                [ "", heartbeat ]
            ]}
            options={{
                redFrom: 160,
                redTo: 220,
                redColor: "rgba(113,69,138,0.57)",
                yellowFrom: 140,
                yellowTo: 160,
                yellowColor: "rgba(72,59,82,0.57)",
                backgroundColor: "rgba(76,82,16,0.57)",
                min: 0,
                max: 220,
                minorTicks: 5,
                is3D: true
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    );
};
export default HeartbeatGauge;