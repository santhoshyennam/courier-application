function dijkstra(grid, start, goal) {
    const rows = grid.length;
    const cols = grid[0].length;
  
    // Initialize distances with infinity except for the start cell
    const distances = new Array(rows).fill().map(() => new Array(cols).fill(Infinity));
    distances[start[0]][start[1]] = 0;
  
    // Priority queue to store cells with their distances
    const pq = [[0, start]];
  
    // Keep track of the parent cells to reconstruct the path
    const parents = new Array(rows).fill().map(() => new Array(cols).fill(null));
  
    // Directions for traversing neighbors (horizontal, vertical, diagonal)
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
  
    while (pq.length) {
      // Pop cell with the smallest distance
      const [dist, cell] = pq.shift();
  
      // Check if reached the goal
      if (cell[0] === goal[0] && cell[1] === goal[1]) {
        break;
      }
  
      // Explore neighbors
      for (const direction of directions) {
        const [dx, dy] = direction;
        const [x, y] = cell;
  
        // Calculate neighbor's coordinates
        const nx = x + dx;
        const ny = y + dy;
  
        // Check if neighbor is within the grid boundaries
        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
          // Calculate the tentative distance to the neighbor
          const neighborDist = dist + grid[nx][ny];
  
          // Update the distance if it's smaller than the current distance
          if (neighborDist < distances[nx][ny]) {
            distances[nx][ny] = neighborDist;
            parents[nx][ny] = cell;
            pq.push([neighborDist, [nx, ny]]);
          }
        }
      }
  
      // Sort the priority queue based on distances
      pq.sort((a, b) => a[0] - b[0]);
    }
  
    // Reconstruct the path
    const path = [];
    let curr = goal;
    while (curr !== start) {
      path.unshift(curr);
      curr = parents[curr[0]][curr[1]];
    }
    path.unshift(start);
  
    return path;
  }
  
  // Example usage
  const grid = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 1]
  ];
  
  const start = [0, 0];
  const goal = [5, 5];
  
  const shortestPath = dijkstra(grid, start, goal);
  console.log('Shortest Path:', shortestPath);
  