"use client";
import React, { useState } from "react";
import Xarrow, { Xwrapper } from "react-xarrows";

// Styling for boxes
const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "10px",
  cursor: "pointer",
  userSelect: "none",
  textAlign: "center",
  width: "120px",
  position: "absolute",
  backgroundColor: "white",
  fontSize: "16px",
  fontWeight: "bold",
};

// Updated left and right positions with IDs and names
const leftPositions = [
  { id: 1, name: "عين", x: 100, y: 80 },
  { id: 2, name: "أذن", x: 100, y: 160 },
  { id: 3, name: "يد", x: 100, y: 240 },
  { id: 4, name: "أنف", x: 100, y: 320 },
  { id: 5, name: "لسان", x: 100, y: 400 },
  { id: 6, name: "جلد", x: 100, y: 480 },
];

const rightPositions = [
  { id: 7, name: "أبصر", x: 300, y: 80 },
  { id: 8, name: "أسمع", x: 300, y: 160 },
  { id: 9, name: "ألمس", x: 300, y: 240 },
  { id: 10, name: "أشم", x: 300, y: 320 },
  { id: 11, name: "أتذوق", x: 300, y: 400 },
  { id: 12, name: "أحس", x: 300, y: 480 },
];

const DraggableBox = ({ id, text, onClick, position }) => {
  return (
    <div
      id={id}
      style={{ ...boxStyle, left: position.x, top: position.y }}
      onClick={() => onClick(id)}
    >
      {text}
    </div>
  );
};

const colors_list = [
  "#0C134F", "#5C469C", "#116D6E", "#2ecc71", "#f39c12", "#000000",
  "#735F32", "#C69749", "#704F4F", "#950101", "#F806CC", "#270082",
  "#7A0BC0", "#610094", "#B25068", "#2a293e", "#112222", "#0000aa",
  "#033500", "#6f7755", "#d1001c", "#c14a09", "#d5b60a", "#220a0a",
  "#341c02"
];

const Page = () => {
  const [selected, setSelected] = useState([]);
  const [connections, setConnections] = useState([]);

  // Handle click to select or deselect boxes and create connections

  const handleClick = (id) => {
    if (selected.includes(id)) {
      setSelected([]);
    } else if (selected.length === 1) {
      const start = selected[0];
      const end = id;

      // Prevent self-connections
      if (start === end) {
        setSelected([]);
        return;
      }

      // Normalize start and end for bidirectional uniqueness
      const sortedConnection = [start, end].sort();

      // Check if the normalized connection already exists
      const isAlreadyConnected = connections.some(
        (conn) =>
          [conn.start, conn.end].sort().join() === sortedConnection.join()
      );

      // Check if the connection involves the currently selected item
      const involvesSelected = connections.some(
        (conn) => conn.start === selected[0] || conn.end === selected[0] || conn.start === id || conn.end === id
      );

      if (!isAlreadyConnected && !involvesSelected) {
        setConnections([...connections, { start: sortedConnection[0], end: sortedConnection[1] }]);
      } else {
        setConnections(
          connections.filter(
            (conn) =>
              [conn.start, conn.end].sort().join() !== sortedConnection.join()
          )
        );
      }

      setSelected([]);
    } else {
      setSelected([id]);
    }
  };



  console.log({ connections, selected })
  const [hoveredArrow, setHoveredArrow] = useState(null);

  const handleDoubleClick = (index) => {
    setConnections((prevConnections) =>
      prevConnections.filter((_, i) => i !== index)
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "600px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Xwrapper>
        {leftPositions.map((pos) => (
          <DraggableBox
            key={pos.id}
            id={pos.id}
            text={pos.name}
            onClick={handleClick}
            position={{ x: pos.x, y: pos.y }}
          />
        ))}
        {rightPositions.map((pos) => (
          <DraggableBox
            key={pos.id}
            id={pos.id}
            text={pos.name}
            onClick={() => handleClick(pos.id)}
            position={{ x: pos.x, y: pos.y }}
          />
        ))}
        {connections.map((conn, index) => {
          const randomColor = colors_list[index];

          return (
            <span
              key={index}
              title="حذف التوصيل"
              onDoubleClick={() => handleDoubleClick(index)}
              onMouseEnter={() => setHoveredArrow(index)}
              onMouseLeave={() => setHoveredArrow(null)}
              style={{ cursor: "pointer" }}
            >
              <Xarrow
                start={conn.start.toString()}
                end={conn.end.toString()}
                color={hoveredArrow === index ? "red" : randomColor}
                strokeWidth={4}
                curveness={0.25}
                animateDrawing={0.5}
                path="smooth"
                showHead={true}
                showTail={true}
              />
            </span>
          );
        })}
      </Xwrapper>
      <button onClick={() => setConnections([])}> reset</button>
    </div>
  );
};

export default Page;
