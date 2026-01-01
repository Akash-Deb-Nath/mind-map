import { useEffect, useRef, useState } from "react";
import calculateNodePositions from "../utility/calculateNodePositions";
import ControlButtons from "./ControlButtons";
import HoverTooltip from "./HoverTooltip";

const MindmapCanvas = ({ data, onNodeClick, selectedNode, onNodeEdit }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredNode, setHoveredNode] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [collapsedNodes, setCollapsedNodes] = useState(new Set([data.id]));
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const nodePositions = calculateNodePositions(data, centerX, centerY, collapsedNodes);

    const getNodeRadius = (size) => {
        switch (size) {
            case 'large': return 80;
            case 'medium': return 55;
            case 'small': return 40;
            default: return 50;
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setTransform(prev => ({
            ...prev,
            scale: Math.max(0.3, Math.min(3, prev.scale * delta))
        }));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    };

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });

        if (isDragging) {
            setTransform(prev => ({
                ...prev,
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            }));
        } else {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                const x = (e.clientX - rect.left - transform.x) / transform.scale;
                const y = (e.clientY - rect.top - transform.y) / transform.scale;

                const hovered = nodePositions.find(node => {
                    const dx = x - node.x;
                    const dy = y - node.y;
                    Math.sqrt(dx * dx + dy * dy) <= node.radius + 8;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    return distance <= getNodeRadius(node.size);
                });

                setHoveredNode(hovered || null);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCanvasClick = (e) => {
        if (isDragging) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        const x = (e.clientX - rect.left - transform.x) / transform.scale;
        const y = (e.clientY - rect.top - transform.y) / transform.scale;

        const clicked = nodePositions.find(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= getNodeRadius(node.size);
        });

        if (clicked) {
            if (clicked.children && clicked.children.length > 0) {
                setCollapsedNodes(prev => {
                    const next = new Set(prev);

                    if (next.has(clicked.id)) {
                        next.delete(clicked.id);

                        clicked.children.forEach(child => {
                            if (child.children && child.children.length > 0) {
                                next.add(child.id);
                                const collapseDescendants = (node) => {
                                    if (node.children) {
                                        node.children.forEach(c => {
                                            next.add(c.id);
                                            collapseDescendants(c);
                                        });
                                    }
                                };
                                collapseDescendants(child);
                            }
                        });
                    } else {
                        next.add(clicked.id);
                    }

                    return next;
                });
            }
            onNodeClick(clicked);
        }
    };

    const handleExpandAll = () => setCollapsedNodes(new Set());

    const handleCollapseAll = () => {
        const ids = new Set();
        const collect = (n) => {
            if (n.children?.length) {
                ids.add(n.id);
                n.children.forEach(collect);
            }
        };
        collect(data);
        setCollapsedNodes(ids);
    };

    const handleFitView = () => {
        setTransform({ x: 0, y: 0, scale: 1 });
        const ids = new Set();
        const collect = (n) => {
            if (n.children?.length) {
                ids.add(n.id);
                n.children.forEach(collect);
            }
        };
        collect(data);
        setCollapsedNodes(ids);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.scale, transform.scale);

        // Draw connections
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        nodePositions.forEach(node => {
            if (node.parentX !== undefined) {
                ctx.beginPath();
                ctx.moveTo(node.parentX, node.parentY);
                ctx.lineTo(node.x, node.y);
                ctx.stroke();
            }
        });

        // Draw nodes
        nodePositions.forEach(node => {
            const radius = getNodeRadius(node.size);
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color || '#60A5FA';
            ctx.fill();

            if (isSelected) {
                ctx.strokeStyle = '#1e40af';
                ctx.lineWidth = 4;
                ctx.stroke();
            } else if (isHovered) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // Draw text
            ctx.fillStyle = node.level === 0 || node.size === 'large' ? '#1f2937' : '#000000';
            ctx.font = node.size === 'large' ? 'bold 18px Inter, sans-serif' : node.size === 'medium' ? 'bold 14px Inter, sans-serif' : '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const words = node.title.split(' ');
            const maxWidth = radius * 1.6;
            let lines = [];
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });
            if (currentLine) lines.push(currentLine);

            const lineHeight = node.size === 'large' ? 22 : node.size === 'medium' ? 18 : 15;
            const startY = node.y - ((lines.length - 1) * lineHeight) / 2;

            lines.forEach((line, i) => {
                ctx.fillText(line, node.x, startY + i * lineHeight);
            });
        });

        ctx.restore();
    }, [nodePositions, transform, selectedNode, hoveredNode]);


    return (
        <div className="relative w-full h-full" ref={containerRef}>
            <ControlButtons
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
                onFitView={handleFitView}
                onAddNode={() => {
                    onNodeEdit(selectedNode || data)
                }}
            />

            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-move"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleCanvasClick}
            />

            <HoverTooltip node={hoveredNode} mousePos={mousePos} />
        </div>
    );
};

export default MindmapCanvas;