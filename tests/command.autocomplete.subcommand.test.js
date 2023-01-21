const commander = require('../');

describe('program should have no completion rules, if there are none defined.', () => {
  test('when no arguments then asterisk action not called', () => {
    const program = new commander.Command();
    program
      .command('clone <url>')
      .option('--debug-level <level>', 'debug level')
      .complete({
        options: {
          '--debug-level': ['info', 'error']
        },
        arguments: {
          url: ['https://github.com/1', 'https://github.com/2']
        }
      });

    program
      .command('add <file1> <file2>')
      .option('-A', 'add all files')
      .option('--debug-level <level>', 'debug level')
      .complete({
        options: {
          '--debug-level': ['info', 'error']
        },
        arguments: {
          file1: ['file1.c', 'file11.c'],
          file2: ['file2.c', 'file21.c']
        }
      });

    expect(program.hasCompletionRules()).toBe(true);

    const rootReply = jest.fn();
    program.autocompleteHandleEvent({
      reply: rootReply,
      fragment: 1,
      line: 'git'
    });

    expect(rootReply).toHaveBeenCalledTimes(1);
    expect(rootReply).toHaveBeenCalledWith([
      'clone',
      'add',
      '--help'
    ]);

    const cloneReply = jest.fn();

    program.autocompleteHandleEvent({
      reply: cloneReply,
      fragment: 2,
      line: 'git clone'
    });

    expect(cloneReply).toHaveBeenCalledTimes(1);
    expect(cloneReply).toBeCalledWith([
      '--debug-level',
      'https://github.com/1',
      'https://github.com/2'
    ]);

    const cloneWithOptionReply = jest.fn();

    program.autocompleteHandleEvent({
      reply: cloneWithOptionReply,
      fragment: 3,
      line: 'git clone --debug-level'
    });

    expect(cloneWithOptionReply).toBeCalledTimes(1);
    expect(cloneWithOptionReply).toHaveBeenCalledWith([
      'info',
      'error'
    ]);

    const addReply = jest.fn();

    program.autocompleteHandleEvent({
      reply: addReply,
      fragment: 2,
      line: 'git add'
    });

    expect(addReply).toHaveBeenCalledTimes(1);
    expect(addReply).toHaveBeenCalledWith([
      '-A',
      '--debug-level',
      'file1.c',
      'file11.c'
    ]);

    const addWithArgReply = jest.fn();

    program.autocompleteHandleEvent({
      reply: addWithArgReply,
      fragment: 3,
      line: 'git add file1.c'
    });

    expect(addWithArgReply).toHaveBeenCalledTimes(1);
    expect(addWithArgReply).toHaveBeenCalledWith([
      '-A',
      '--debug-level',
      'file2.c',
      'file21.c'
    ]);
  });
});
