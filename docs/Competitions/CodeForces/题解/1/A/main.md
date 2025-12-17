# 题解

地板除法

## V1
```C
#include <stdio.h>  
  
int main(void) {  
    int n, m, a;  
    scanf("%d %d %d", &n, &m, &a);  
    long long p, q;  
    if (n % a == 0) {  
        p = n / a;  
    }  
    else {  
        p = n / a + 1;  
    }  
    if (m % a == 0) {  
        q = m / a;  
    }  
    else {  
        q = m / a + 1;  
    }  
    long long out = p * q;  
    printf("%lld", out);  
    return 0;  
}
```
