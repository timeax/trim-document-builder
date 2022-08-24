import React, { useEffect, useState } from 'react'

const Progress = ({ reg }) => {
    const [points, setPoints] = useState(0);
    const [range, setRange] = useState(0);
    const [noVoters, setVoters] = useState(0);
    //----
    useEffect(() => {
        async function getData() {
            const res = await fetch('/get_records', {
                method: 'POST',
                body: JSON.stringify({ reg: reg }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            setPoints(data?.points || 0);
            setRange(data?.users || 0);
            setVoters(data?.votes || 0);
        }

        getData();
    }, [reg]);

    const calc = () => {
        const top = (points - (9 * noVoters)) * 100;
        const bottom = 41 * range;

        return top / bottom;
    }
    return (
        <div className='progress-bar' title={reg}>
            <div className="thumb" style={{ width: calc() + '%' }}></div>
        </div>
    )
}

export default Progress
