function fib(n) {
    var a = 1;
    var b = 1;
    for (i = 1; i < n-1; i++) {
        a = b;
        b = a + b;
    }

    return a;
}
