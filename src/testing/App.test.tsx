import assert from 'assert';
import { getSTVisitor } from '../languages/ModelSemanticChecker';
import { SymbolTableVisitor } from '../languages/SymbolTableVisitor';
import * as monaco from 'monaco-editor';
import * as fs from 'fs';
import { join } from 'path';
import { FileChangeType } from 'vscode';
import { isSubtTypeOf, varTypes } from '../languages/Types';
import { Variable } from '../languages/Variable';

jest.mock('monaco-editor', () => ({
    MarkerSeverity: {
        Hint: 1,
        Info: 2,
        Warning: 4,
        Error: 8,
    },
}));
    


// test('renders title', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/The Official Antimony Web Code Editor/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('renders editor', () => {
//   render(<App />);
//   expect(<AntimonyEditor />).toBeInTheDocument();
// });
describe('Type Tests', function() {
    it('isSubTypeOf tests', function() {
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

        assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable ,varTypes.Parameter), false);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable ,varTypes.Species), false);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable ,varTypes.Compartment), false);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable ,varTypes.Reaction), false);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Variable ,varTypes.Constraint), false);

        

        assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Parameter), true);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Species, varTypes.Parameter), true);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Compartment, varTypes.Parameter), true);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Reaction, varTypes.Parameter), true);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Constraint, varTypes.Parameter), true);


        assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Species), false);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Compartment), false);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Reaction), false);
        assert.deepStrictEqual(isSubtTypeOf(varTypes.Parameter, varTypes.Constraint), false);
    })  
})

describe('SymbolTableVisitor Error Tests', function() {
    it('func redeclaration', function() {
        const file1: string = fs.readFileSync(join(__dirname, 'testAntFiles', 'repeatFuncDecl.ant'), 'utf-8');
        const out: SymbolTableVisitor = getSTVisitor(file1);
        assert.deepStrictEqual(out.getErrors(), [
            {
                startLineNumber: 5,
                startColumn: 10,
                endLineNumber: 5,
                endColumn: 12,
                message: 'function \'fn\' already defined on line 1:10',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 9,
                startColumn: 10,
                endLineNumber: 9,
                endColumn: 12,
                message: 'function \'fn\' already defined on line 1:10',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 17,
                startColumn: 10,
                endLineNumber: 17,
                endColumn: 12,
                message: 'function \'on\' already defined on line 13:10',
                severity: monaco.MarkerSeverity.Error
            }
        ]);
    })

    it('model redeclaration', function() {
        const file1: string = fs.readFileSync(join(__dirname, 'testAntFiles', 'repeatModelDecl.ant'), 'utf-8');
        const out: SymbolTableVisitor = getSTVisitor(file1);
        assert.deepStrictEqual(out.getErrors(), [
            {
                startLineNumber: 6,
                startColumn: 1,
                endLineNumber: 9,
                endColumn: 2,
                message: 'model \'m1\' already defined on line 1:7',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 11,
                startColumn: 1,
                endLineNumber: 14,
                endColumn: 2,
                message: 'model \'m1\' already defined on line 1:7',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 22,
                startColumn: 1,
                endLineNumber: 27,
                endColumn: 2,
                message: 'model \'m2\' already defined on line 16:7',
                severity: monaco.MarkerSeverity.Error
            }
        ]);
    })

    it('assignment override warning', function() {
        const file1: string = fs.readFileSync(join(__dirname, 'testAntFiles', 'assignmentOverride.ant'), 'utf-8');
        const out: SymbolTableVisitor = getSTVisitor(file1);
        //'Value assignment to 'S5' is overriding previous assignment on line 14:11'
        //'Value assignment to 'S2' is being overridden by a later assignment on line 12:3'
        assert.deepStrictEqual(out.getErrors(), [
            {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 6,
                message: 'Value assignment to \'A\' is being overridden by a later assignment on line 2:1',
                severity: monaco.MarkerSeverity.Warning
            },
            {
                startLineNumber: 2,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 6,
                message: 'Value assignment to \'A\' is overriding previous assignment on line 1:1',
                severity: monaco.MarkerSeverity.Warning
            },
            {
                startLineNumber: 2,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 6,
                message: 'Value assignment to \'A\' is being overridden by a later assignment on line 3:1',
                severity: monaco.MarkerSeverity.Warning
            },
            {
                startLineNumber: 3,
                startColumn: 1,
                endLineNumber: 3,
                endColumn: 6,
                message: 'Value assignment to \'A\' is overriding previous assignment on line 2:1',
                severity: monaco.MarkerSeverity.Warning
            },

            {
                startLineNumber: 5,
                startColumn: 9,
                endLineNumber: 5,
                endColumn: 15,
                message: 'Value assignment to \'B1\' is being overridden by a later assignment on line 6:9',
                severity: monaco.MarkerSeverity.Warning
            },
            {
                startLineNumber: 6,
                startColumn: 9,
                endLineNumber: 6,
                endColumn: 15,
                message: 'Value assignment to \'B1\' is overriding previous assignment on line 5:9',
                severity: monaco.MarkerSeverity.Warning
            },
            {
                startLineNumber: 6,
                startColumn: 9,
                endLineNumber: 6,
                endColumn: 15,
                message: 'Value assignment to \'B1\' is being overridden by a later assignment on line 7:9',
                severity: monaco.MarkerSeverity.Warning
            },
            {
                startLineNumber: 7,
                startColumn: 9,
                endLineNumber: 7,
                endColumn: 15,
                message: 'Value assignment to \'B1\' is overriding previous assignment on line 6:9',
                severity: monaco.MarkerSeverity.Warning
            },
        ]);
    })

    it('type override error', function() {
        const file1: string = fs.readFileSync(join(__dirname, 'testAntFiles', 'typeOverride.ant'), 'utf-8');
        const out: SymbolTableVisitor = getSTVisitor(file1);
        assert.deepStrictEqual(out.getErrors(), [
            {
                startLineNumber: 3,
                startColumn: 9,
                endLineNumber: 3,
                endColumn: 10,
                message: 'Unable to set the type to \'species\' because it is already set to be the incompatible type \'compartment\' on line 2:13',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 4,
                startColumn: 1,
                endLineNumber: 4,
                endColumn: 2,
                message: 'Unable to set the type to \'species\' because it is already set to be the incompatible type \'compartment\' on line 2:13',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 4,
                startColumn: 5,
                endLineNumber: 4,
                endColumn: 6,
                message: 'Unable to set the type to \'species\' because it is already set to be the incompatible type \'compartment\' on line 2:16',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 4,
                startColumn: 14,
                endLineNumber: 4,
                endColumn: 15,
                message: 'Unable to set the type to \'species\' because it is already set to be the incompatible type \'compartment\' on line 2:13',
                severity: monaco.MarkerSeverity.Error
            },
            {
                startLineNumber: 4,
                startColumn: 18,
                endLineNumber: 4,
                endColumn: 19,
                message: 'Unable to set the type to \'species\' because it is already set to be the incompatible type \'compartment\' on line 2:16',
                severity: monaco.MarkerSeverity.Error
            }
        ]);
    })
})