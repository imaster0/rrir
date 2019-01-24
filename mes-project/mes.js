let n = 3;
let k = 1;
let SCREEN_WIDTH = 800;
let SCREEN_HEIGHT = 800;

// u z daszkiem
let pomU = x => 5 * e(0, x);

// (u z daszkiem)'
let pomdU = x => 5 * de(0, x);

// e
let e = (i, x) => {
  if (x <= i/n && x >= (i - 1)/n) { 
    return n*x - i + 1; 
  } else if (x >= i/n && x <= (i + 1)/n) {
    return -n*x + i + 1;
  } else {
    return 0;
  }
}

// e'
let de = (i, x) => {
  if (x <= i/n && x >= (i - 1)/n) { 
    return n; 
  } else if (x >= i/n && x <= (i + 1)/n) {
    return -n;
  } else {
    return 0;
  }
}

// mX - obliczone współczynniki
let mX;

// u(x) = ...
function fff(x) {
  let result = pomU(x);

  for (let i = 0; i <= n; i++) {
    result += e(i, x) * mX[i];
  }

  return result;
}


function integral(fun, a, b, delta = 0.001) {
  let result = 0;
  for (let i = a; i + delta <= b; i += delta) {
    result += fun(i) + fun(i + delta);
  }
  return result * delta / 2;
}



  function gauss2(A) {
    var n = A.length;

    for (var i=0; i<n; i++) {
        // Search for maximum in this column
        var maxEl = Math.abs(A[i][i]);
        var maxRow = i;
        for(var k=i+1; k<n; k++) {
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i]);
                maxRow = k;
            }
        }

        for (var k=i; k<n+1; k++) {
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }

        for (k=i+1; k<n; k++) {
            var c = -A[k][i]/A[i][i];
            for(var j=i; j<n+1; j++) {
                if (i==j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }

    var x= new Array(n);
    for (var i=n-1; i>-1; i--) {
        x[i] = A[i][n]/A[i][i];
        for (var k=i-1; k>-1; k--) {
            A[k][n] -= A[k][i] * x[i];
        }
    }
    return x;
}

//B(u, v) = k * int_{0}^{1} u'(x) * v'(x) dx + int_{0}^{1} u'(x) * v(x) dx
function funB(u, v, du, dv) {
  let pomf = x => du(x) * dv(x);
  let pomf2 = x => du(x) * v(x);
  return k*integral(pomf, 0, 1) + integral(pomf2, 0, 1) + k * du(0) * v(0);
}

// L(v) = int_{0}^{1} (5x - 10) * v(x) dx + 3 * k * v(1)
function funL(v) {
  let funF = x => (5*x - 10) * v(x);
  return integral(funF, 0, 1) + 3 * k * v(1);
}

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);  
  stroke(255);   
  frameRate(30);
  background(0); 
  
  // tworzenie macierzy B o wymiarach (n+1) x (n+1)
  let B = new Array(n+1);
  for (let i = 0; i <= n; i++) {
    B[i] = new Array(n+1);
    for (let j = 0; j <= n; j++) B[i][j] = 0;
  }

  // obliczenie kolejnych wartości B(e_i, e_j)
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      B[j][i] = funB(x => e(i, x), x => e(j, x), x => de(i, x), x => de(j, x));
    }
  }


  // tworzenie macierzy L o wymiarach (n+1) x 1
  let L = new Array(n+1);
  for (let i = 0; i <= n; i++) L[i] = 0;

  // obliczenie kolejnych wartości L = L(e_i) - B(u z daszkiem, e_i)
  for (let i = 0; i <= n; i++) {
    L[i] = funL(x => e(i, x)) - funB(pomU, x => e(i, x), pomdU, x => de(i, x));
  }

  // z warunku w(0) = 0 zerowanie
  for (let i = 1; i <= n; i++) B[0][i] = B[i][0] = 0;
  L[0] = 0;
  B[0][0] = 1;
  
  console.log(B);
  for (let i = 0; i <= n; i++) B[i].push(L[i]);
  console.log(L);
  
  mX = gauss2(B);
  console.log(mX);
  
  strokeJoin(ROUND);
  noFill();
  beginShape();
  for (let i = 0; i < SCREEN_WIDTH; i += 0.01) {
    let fY = x => SCREEN_HEIGHT / 2 - SCREEN_HEIGHT/20 * fff(x / SCREEN_WIDTH); 
    vertex(i, fY(i));
  }
  endShape();

  var dataX  = document.getElementById("demo");
  var dataY  = document.getElementById("demo2");
  for (let i = 0; i <= 1; i += 0.01) {
    dataX.innerHTML = (dataX.innerHTML + i + "<br>").replace(".", ",");
    dataY.innerHTML = (dataY.innerHTML + fff(i) + "<br>").replace(".", ",");
  }
}
