"use client";

import { useEffect, useRef, useState } from 'react';

interface GameState {
  playerPaddle: { y: number };
  computerPaddle: { y: number };
  ball: { x: number; y: number; dx: number; dy: number };
  playerScore: number;
  computerScore: number;
}

export default function PingPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    playerPaddle: { y: 250 },
    computerPaddle: { y: 250 },
    ball: { x: 400, y: 300, dx: -5, dy: 5 },
    playerScore: 0,
    computerScore: 0,
  });

  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;
  const CANVAS_HEIGHT = 600;
  const CANVAS_WIDTH = 800;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = setInterval(() => {
      // Update ball position
      setGameState((prev) => {
        const newState = { ...prev };
        newState.ball.x += newState.ball.dx;
        newState.ball.y += newState.ball.dy;

        // Ball collision with top and bottom walls
        if (newState.ball.y <= 0 || newState.ball.y >= CANVAS_HEIGHT) {
          newState.ball.dy *= -1;
        }

        // Ball collision with paddles
        if (
          newState.ball.x <= PADDLE_WIDTH &&
          newState.ball.y >= prev.playerPaddle.y &&
          newState.ball.y <= prev.playerPaddle.y + PADDLE_HEIGHT
        ) {
          newState.ball.dx *= -1;
        }

        if (
          newState.ball.x >= CANVAS_WIDTH - PADDLE_WIDTH &&
          newState.ball.y >= prev.computerPaddle.y &&
          newState.ball.y <= prev.computerPaddle.y + PADDLE_HEIGHT
        ) {
          newState.ball.dx *= -1;
        }

        // Score points
        if (newState.ball.x <= 0) {
          newState.computerScore += 1;
          newState.ball = { x: 400, y: 300, dx: 5, dy: 5 };
        }
        if (newState.ball.x >= CANVAS_WIDTH) {
          newState.playerScore += 1;
          newState.ball = { x: 400, y: 300, dx: -5, dy: 5 };
        }

        // Simple AI for computer paddle
        if (prev.ball.y > prev.computerPaddle.y + PADDLE_HEIGHT / 2) {
          newState.computerPaddle.y += 5;
        } else {
          newState.computerPaddle.y -= 5;
        }

        return newState;
      });

      // Draw game
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, gameState.playerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(
        CANVAS_WIDTH - PADDLE_WIDTH,
        gameState.computerPaddle.y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );

      // Draw ball
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, BALL_SIZE, 0, Math.PI * 2);
      ctx.fill();

      // Draw scores
      ctx.font = '30px Arial';
      ctx.fillText(gameState.playerScore.toString(), 100, 50);
      ctx.fillText(gameState.computerScore.toString(), CANVAS_WIDTH - 100, 50);
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, []);

  // Handle player paddle movement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    setGameState((prev) => ({
      ...prev,
      playerPaddle: {
        y: Math.max(0, Math.min(mouseY - PADDLE_HEIGHT / 2, CANVAS_HEIGHT - PADDLE_HEIGHT)),
      },
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
        className="border border-gray-600"
      />
    </div>
  );
} 