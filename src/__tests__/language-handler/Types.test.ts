import assert from 'assert';
import { isSubtTypeOf, varTypes } from '../../language-handler/Types';

describe('Type Tests', function () {
  it('isSubTypeOf tests', function () {
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable, varTypes.Unknown), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Model, varTypes.Unknown), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Function, varTypes.Unknown), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Unit, varTypes.Unknown), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.ModularModel, varTypes.Unknown), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Import, varTypes.Unknown), true);

    // missing interaction and event
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Variable), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Species, varTypes.Variable), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Compartment, varTypes.Variable), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Reaction, varTypes.Variable), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Constraint, varTypes.Variable), true);

    assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable, varTypes.Parameter), false);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable, varTypes.Species), false);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable, varTypes.Compartment), false);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable, varTypes.Reaction), false);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable, varTypes.Constraint), false);



    assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Parameter), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Species, varTypes.Parameter), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Compartment, varTypes.Parameter), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Reaction, varTypes.Parameter), true);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Constraint, varTypes.Parameter), true);


    assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Species), false);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Compartment), false);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Reaction), false);
    assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Constraint), false);

    assert.deepStrictEqual(isSubtTypeOf(varTypes.Event, varTypes.Variable), true);
  })
});