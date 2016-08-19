/**
 * Make all the tests pass!
 * PS.: ES6 allowed!
 */


/** ??????? = function(???????? **/
/**
* YOUR SOLUTION GOES HERE
*/


Array.prototype.duplicate = function() {
	if(this){
    return [
      ...this,
      ...this
    ]
  }

}

expect(
	[1, 2].duplicate()
).toEquals(
	[1, 2, 1, 2]
);

expect(
	['foo', 'bar'].duplicate()
).toEquals(
	['foo', 'bar', 'foo', 'bar']
);




















function add(...params) {
	/**
     * YOUR SOLUTION GOES HERE
	 */

   return params.reduce((prev, curr) => prev + curr, 0);
}

expect(
	add(1, 2, 3)
).toEquals(
	6
);

expect(
	add(5, 5)
).toEquals(
	10
);





















function addTwo(...params) {
	/**
     * YOUR SOLUTION GOES HERE
	 */

    let addAll = (...allParams) => {
   		return allParams.reduce((prev, curr) => prev + curr, 0);
   }

    if(params.length < 0) {
    	return addAll
    }
		else{
    	return
    }


   if(params1.length < 2){
     return (...params2) => {
     	return params1[0] + params2[0];
     }
   }
   else{
   		return params1.reduce((prev, curr) => prev + curr, 0);
   }


}


expect(
	addTwo(2, 2)
).toEquals(
	4
);

expect(
	addTwo(2)(3)
).toEquals(
	5
);

expect(
	addTwo(2, 0)
).toEquals(
	2
);



















function check(v1, v2) {
    /**
     * YOUR SOLUTION GOES HERE
     */

     return v1 === v2
}

function checkCoerced(v1, v2) {
    /**
     * YOUR SOLUTION GOES HERE
     */

     return v1 == v2
}

expect(check(1, true)).toEquals(false);
expect(check(true, true)).toEquals(true);
expect(checkCoerced(1, true)).toEquals(true);
expect(checkCoerced('1', true)).toEquals(true);






























const a = {
    name: 'Matt',
    greeting: 'Hello',
    sayIt: function(suffix) {
        return  `${this.greeting}, ${this.name}${suffix}`;
    },
};

const b = {
    name: 'Rebecca',
    greeting: 'Yo'
};

function alterContext(fn, context) {
    /**
     * YOUR SOLUTION GOES HERE
     */

     return fn.bind(context);
}

expect(
	alterContext(a.sayIt, b)('!!')
).toEquals(
	'Yo, Rebecca!!'
);
























function times(times, fn) {
    /**
     * YOUR SOLUTION GOES HERE
     */

     while(times-- > 0){
     		fn()
     }
}


const foo = {
	fn() { console.log('hello!'); }
};
const fnSpy = expect.spyOn(foo, 'fn').andCallThrough();
times(3, foo.fn);
expect(fnSpy.calls.length).toEquals(3);
