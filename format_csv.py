import csv
from io import StringIO

def format_csv(input_file, output_file):
    with open(input_file, 'r') as f:
        content = f.read()
    
    # Process the content to replace newlines within quotes
    in_quotes = False
    new_content = []
    buffer = []
    
    for char in content:
        if char == '"':
            in_quotes = not in_quotes
        
        if in_quotes and char == '\n':
            buffer.append('\\n')
        else:
            buffer.append(char)
    
    formatted_content = ''.join(buffer)
    
    # Write the formatted content
    with open(output_file, 'w') as f:
        f.write(formatted_content)

if __name__ == "__main__":
    input_file = "api/github_mcp_1.csv"
    output_file = "api/github_mcp_1_formatted.csv"
    format_csv(input_file, output_file)
    print(f"Formatted CSV has been written to {output_file}") 