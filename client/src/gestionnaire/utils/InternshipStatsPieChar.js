import React, { Component } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import '../css/InternshipStats.css';


class InternshipStatsPieChart extends Component {
  state = {
    data: [],
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:3001/gestionnaire/internship-stats');
      this.setState({ data: response.data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { data, loading, error } = this.state;
    const COLORS = ['#82ca9d', '#FF8042']; // Colors for the pie chart segments

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="pie-chart-wrapper">
        <div>
          <h2 className="pie-chart-title">Statistiques des Stages</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default InternshipStatsPieChart;
