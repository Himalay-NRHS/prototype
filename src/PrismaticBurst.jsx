import { useEffect, useRef } from 'react';
import './PrismaticBurst.css';

const PrismaticBurst = ({
  animationType = 'rotate3d',
  intensity = 2,
  speed = 0.5,
  distort = 1.0,
  paused = false,
  offset = { x: 0, y: 0 },
  hoverDampness = 0.25,
  rayCount = 24,
  mixBlendMode = 'lighten',
  colors = ['#0000FF', '#1E90FF', '#87CEEB']
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const drawRay = (angle, length, color, alpha) => {
      const centerX = canvas.offsetWidth / 2 + offset.x;
      const centerY = canvas.offsetHeight / 2 + offset.y;
