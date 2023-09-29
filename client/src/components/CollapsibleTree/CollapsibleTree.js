import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function CollapsibleTree({ data }) {
  const allTheData = data;
  console.log("Collapsible Tree Here.")
  const svgRef = useRef();

  const txTypeSortObj = {};
  console.log("alltehdata: ", data)
  allTheData.transactions.forEach(obj => {
    const transactionType = obj.TransactionType;

    if (!txTypeSortObj[transactionType]) {
      txTypeSortObj[transactionType] = [obj];
    } else {
      txTypeSortObj[transactionType].push(obj);
    }
  });

  function toHierarchy(data) {
    const rootNode = { name: allTheData.account.slice(0, 6) + "...", children: [] };

    // Helper function to conditionally add properties
    const conditionalAssign = (obj, key, value) => {
      if (value !== undefined) {
        obj[key] = value;
      };
    };

    Object.keys(data).forEach(key => {
      const children = data[key].map(item => {
        console.log(item);
        const child = {
          name: item.date.split("T")[0],
          children: []
        };

        // Conditionally assign properties
        conditionalAssign(child, 'account', item.Account);
        conditionalAssign(child, 'amount', item.Amount ? item.Amount.value / 1000000 + item.Amount.currency : undefined);
        conditionalAssign(child, 'destination', item.Destination);
        conditionalAssign(child, 'date', item.date.split("T")[0]);
        conditionalAssign(child, 'hash', item.hash);

        return child;
      });
      rootNode.children.push({ name: key, children });
    });

    console.log(rootNode);
    return rootNode;
  };

  function generateTooltipContent(d) {
    let content = `Name: ${d.data.name}<br/>`;

    if (d.data.account) content += `Account: ${d.data.account}<br/>`;
    if (d.data.amount) content += `Amount: ${d.data.amount}<br/>`;
    if (d.data.destination) content += `Destination: ${d.data.destination}<br/>`;
    if (d.data.hash) content += `Hash: ${d.data.hash}<br/>`;
    if (d.data.date) content += `Date: ${d.data.date.split("T")[0]}<br/>`;

    return content;
  };

  let tooltipTimeout;

  useEffect(() => {
    const tooltip = d3.select("body")
      .append("div")
      .attr("id", "yourTooltipID")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("opacity", "1")
      .style("font-size", "8px")
      // .style("max-width", "260px")
      .style("display", "none")
      .style("overflow", "hidden")
      .style("margin-top", "8px")
      .style("color", "#bc4f0d");

    tooltip.on("mouseout", () => {
      tooltip.style("display", "none");
    });

    const hierarchicalData = toHierarchy(txTypeSortObj);
    const svg = d3.select(svgRef.current);

    // Specify the charts’ dimensions. 
    const width = window.innerWidth - 100;
    console.log("widht: ", width)
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 60;

    const root = d3.hierarchy(hierarchicalData);
    const dx = 18;
    const dy = 1.1 * (width - marginRight - marginLeft) / (1 + root.height);

    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => (d.x));

    svg.attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", "width: 100%; min-height: 80px; height: auto; font: 10px sans-serif; user-select: none; padding: 5px; border-radius: 10px; margin-top: 12px;")

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#CFA14E")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);


    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all")


    function update(event, source) {
      const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      const transition = svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 1)
        .attr("color", "#CFA14E")
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        })
        .on("mouseover", (event, d) => {
          tooltip.transition()
            .duration(200)
            .style("display", "block");
          tooltip.html(generateTooltipContent(d))
            .style("left", (event.pageX - 120) + "px")
            .style("top", (event.pageY - 0) + "px")
            ;
        })
        .on("mouseout", (event, d) => {
          clearTimeout(tooltipTimeout); // Clear any existing timeout
          tooltipTimeout = setTimeout(() => {
            // Check if the mouse is not over the tooltip
            if (!d3.select("#yourTooltipID:hover").node()) {
              tooltip.style("display", "none");
            }
          }, 1000); // 500 ms delay before hiding the tooltip
        });

      nodeEnter.append("circle")
        .attr("r", 4)
        .attr("fill", d => d._children ? "#bc7f0d" : "#CFA14E")
        .attr("stroke-width", 10);

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
        .attr("fill", "white")  // Set the text color to white
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 1)
        .attr("stroke", "#bc7f0d");


      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    update(null, root);

    // Clean-up function for useEffect
    return () => {
      svg.selectAll('*').remove();
      tooltip.remove();
    };

  }, [data]);

  return <svg ref={svgRef} />
}
export default CollapsibleTree;

