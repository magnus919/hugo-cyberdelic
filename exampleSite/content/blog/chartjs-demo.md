---
title: 'Interactive Charts with Chart.js'
date: 2026-06-01
draft: false
tags: ['charts', 'demo', 'shortcodes']
description: 'Demonstrating the Chart.js shortcode with various chart types and configurations.'
---

The Chart.js shortcode renders interactive charts using the Chart.js library loaded from CDN. Charts
are responsive, accessible, and gracefully fall back to a data table when the CDN is unavailable.

## Bar Chart

A basic bar chart showing monthly revenue data:

{{< chart type="bar" labels="Jan,Feb,Mar,Apr,May,Jun" dataset="Revenue" data="12000,19000,15000,22000,18000,25000" backgroundColor="#3847FF,#FF00AA,#00FFFF,#FFB000,#7A00FF,#00FF88" title="Monthly Revenue 2025" >}}

## Line Chart

A line chart tracking user growth over time:

{{< chart type="line" labels="Q1,Q2,Q3,Q4" dataset="Users" data="500,1200,2800,4500" backgroundColor="#00FFFF" borderColor="#00FFFF" title="User Growth" >}}

## Pie Chart

A pie chart showing market share distribution:

{{< chart type="pie" labels="Product A,Product B,Product C,Product D" dataset="Market Share" data="35,28,22,15" backgroundColor="#3847FF,#FF00AA,#00FFFF,#FFB000" title="Market Share Distribution" >}}

## Doughnut Chart

A doughnut chart for budget allocation:

{{< chart type="doughnut" labels="Engineering,Marketing,Sales,Operations,Research" dataset="Budget" data="40,25,15,12,8" backgroundColor="#3847FF,#FF00AA,#00FFFF,#FFB000,#7A00FF" title="Budget Allocation" >}}

## Radar Chart

A radar chart comparing skill levels:

{{< chart type="radar" labels="JavaScript,CSS,Python,Go,Rust,Design" dataset="Skill Level" data="90,85,75,60,45,70" backgroundColor="'rgba(56, 71, 255, 0.2)'" borderColor="#3847FF" title="Technical Skills Assessment" >}}

## Polar Area Chart

A polar area chart for survey results:

{{< chart type="polarArea" labels="Excellent,Good,Average,Poor" dataset="Rating" data="45,30,18,7" backgroundColor="#00FF88,#3847FF,#FFB000,#FF4444" title="Customer Satisfaction" >}}

## Minimal Chart (No Title)

A chart without a title, using default colors:

{{< chart type="bar" labels="A,B,C,D,E" data="10,20,30,25,15" >}}

## Custom Dataset Label

Using a custom dataset label instead of the default:

{{< chart type="line" labels="Week 1,Week 2,Week 3,Week 4" dataset="Page Views" data="1500,2200,1800,2900" backgroundColor="#FF00AA" borderColor="#FF00AA" title="Weekly Traffic" >}}
