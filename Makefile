REPORTER = spec

test:
	@time ./node_modules/.bin/mocha --reporter $(REPORTER) $(T) $(TESTS)

test-cov: lib-cov
	@CRUDL_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test
