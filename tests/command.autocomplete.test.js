const commander = require('../');

describe('program should have no completion rules, if there are none defined.', () => {
  test('when no arguments then asterisk action not called', () => {
    const program = new commander.Command();
    expect(program.hasCompletionRules()).toBe(false);
  });
});

describe('program should have completion rules, if defined.', () => {
  const program = new commander.Command();
  program.arguments('<filename>')
    .option('--verbose', 'verbose')
    .option('-o, --output <file>', 'output')
    .option('--debug-level <level>', 'debug level')
    .option('-m <mode>', 'mode')
    .complete({
      options: {
        '--output': () => { return ['file1', 'file2']; },
        '--debug-level': ['info', 'error'],
        '-m': (typedArgs) => { return typedArgs; }
      },
      arguments: {
        filename: ['file1.c', 'file2.c']
      }
    });

  test('when no arguments then asterisk action not called', () => {
    expect(program.hasCompletionRules()).toBe(true);

    expect(program.autocompleteNormalizeRules()).toEqual({
      options: {
        '--verbose': {
          arity: 0,
          sibling: null,
          reply: []
        },
        '-o': {
          arity: 1,
          sibling: '--output',
          reply: program._completionRules.options['--output']
        },
        '--output': {
          arity: 1,
          sibling: '-o',
          reply: program._completionRules.options['--output']
        },
        '--debug-level': {
          arity: 1,
          sibling: null,
          reply: ['info', 'error']
        },
        '-m': {
          arity: 1,
          sibling: undefined,
          reply: program._completionRules.options['-m']
        }
      },
      args: [
        ['file1.c', 'file2.c']
      ]
    });

    expect(program.autocompleteCandidates([])).toEqual([
      '--verbose',
      '-o',
      '--output',
      '--debug-level',
      '-m',
      'file1.c',
      'file2.c'
    ]);

    expect(program.autocompleteCandidates(['--verbose'])).toEqual([
      '-o',
      '--output',
      '--debug-level',
      '-m',
      'file1.c',
      'file2.c'
    ]);

    expect(program.autocompleteCandidates(['-o'])).toEqual([
      'file1',
      'file2'
    ]);

    expect(program.autocompleteCandidates(['--output'])).toEqual([
      'file1',
      'file2'
    ]);

    expect(program.autocompleteCandidates(['--debug-level'])).toEqual([
      'info',
      'error'
    ]);

    expect(program.autocompleteCandidates(['-m'])).toEqual([
      '-m'
    ]);

    expect(program.autocompleteCandidates(['--verbose', '-m'])).toEqual([
      '--verbose',
      '-m'
    ]);

    expect(program.autocompleteCandidates([
      '--verbose',
      '-o', 'file1',
      '--debug-level', 'info',
      '-m', 'production'
    ])).toEqual([
      'file1.c',
      'file2.c'
    ]);

    // nothing to complete
    expect(program.autocompleteCandidates([
      '--verbose',
      '-o', 'file1',
      '--debug-level', 'info',
      '-m', 'production',
      'file1.c'
    ])).toEqual([]);

    // place arguments in different position
    expect(program.autocompleteCandidates([
      'file1.c',
      '-o', 'file1',
      '--debug-level', 'info',
      '-m', 'production'
    ])).toEqual([
      '--verbose'
    ]);

    // should handle the case
    // when provide more args than expected
    expect(program.autocompleteCandidates([
      'file1.c',
      'file2.c',
      '--verbose',
      '-o', 'file1',
      '--debug-level', 'info',
      '-m', 'production'
    ])).toEqual([]);
  });
});
