完整代码https://github.com/Algacez/c2025-a/blob/main/level1/p07_maze/main.c

- **天然回溯**：递归在没有可行方向时会自动返回上一层，正好对应迷宫里「走到死胡同就退回」的行为。

```c
void generate_maze_recursive(int x, int y) {
    maze[y][x] = PATH;

    int directions[4] = {0, 1, 2, 3};
    int dx[] = {0, 2, 0, -2};
    int dy[] = {-2, 0, 2, 0};

    for (int i = 0; i < 4; i++) {
        int j = rand() % 4;
        int temp = directions[i];
        directions[i] = directions[j];
        directions[j] = temp;
    }

    for (int i = 0; i < 4; i++) {
        int nx = x + dx[directions[i]];
        int ny = y + dy[directions[i]];

        if (is_valid(nx, ny) && maze[ny][nx] == WALL) {
            maze[y + dy[directions[i]] / 2][x + dx[directions[i]] / 2] = PATH;
            generate_maze_recursive(nx, ny);
        }
    }
}
```