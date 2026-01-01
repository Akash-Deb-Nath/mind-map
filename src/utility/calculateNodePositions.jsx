import React from 'react';

const calculateNodePositions = (node, centerX, centerY, collapsedNodes, radius = 250, startAngle = 0, endAngle = 360, level = 0) => {
    const positions = [];

    if (level === 0) {
        positions.push({
            ...node,
            x: centerX,
            y: centerY,
            level,
            size: 'large',
            radius: 100
        });
    }

    if (node.children && !collapsedNodes.has(node.id)) {
        const angleStep = (endAngle - startAngle) / node.children.length;
        const childRadius = level === 0 ? radius : 180;

        node.children.forEach((child, index) => {
            const angle = (startAngle + angleStep * index + angleStep / 2) * (Math.PI / 180);
            const childX = centerX + Math.cos(angle) * childRadius;
            const childY = centerY + Math.sin(angle) * childRadius;

            const nodeRadius = level === 0 ? 70 : level === 1 ? 50 : 40;

            positions.push({
                ...child,
                x: childX,
                y: childY,
                level: level + 1,
                parentX: centerX,
                parentY: centerY,
                radius: nodeRadius
            });

            if (child.children && !collapsedNodes.has(child.id)) {
                const childAngleStart = startAngle + angleStep * index;
                const childAngleEnd = childAngleStart + angleStep;
                const grandchildPositions = calculateNodePositions(
                    child,
                    childX,
                    childY,
                    collapsedNodes,
                    120,
                    childAngleStart,
                    childAngleEnd,
                    level + 2
                );
                positions.push(...grandchildPositions);
            }
        });
    }

    return positions;
};

export default calculateNodePositions;