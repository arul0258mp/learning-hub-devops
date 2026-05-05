import re

def process_file():
    with open('frontend/data/courses.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by subtopic objects
    parts = re.split(r'(id:\s*["\'][a-zA-Z0-9_-]+["\'],)', content)
    
    out = [parts[0]]
    for i in range(1, len(parts), 2):
        chunk_id = parts[i]
        chunk_body = parts[i+1]
        
        # Check if this subtopic already has a quiz
        if 'quiz:' not in chunk_body:
            # We need to insert quiz after suggestedQuestions array
            # Find the end of suggestedQuestions array
            match = re.search(r'(suggestedQuestions:\s*\[.*?\])(\s*)\n(\s*)\}', chunk_body, re.DOTALL)
            if match:
                suggested_q = match.group(1)
                newline1 = match.group(2)
                indent = match.group(3)
                
                quiz_str = suggested_q + ''',
          quiz: [
            {
              question: "What is the key takeaway from this module?",
              options: ["Keep practicing", "Read more docs", "Build projects", "All of the above"],
              answer: 3
            },
            {
              question: "How can you best apply this knowledge?",
              options: ["By taking a break", "By implementing it in code", "By memorizing terms", "None of the above"],
              answer: 1
            },
            {
              question: "Why is this concept important?",
              options: ["It saves time", "It optimizes performance", "It is fundamental to the architecture", "All of the above"],
              answer: 3
            }
          ]'''
                
                chunk_body = chunk_body[:match.start()] + quiz_str + newline1 + '\n' + indent + '}' + chunk_body[match.end():]

        out.append(chunk_id)
        out.append(chunk_body)
        
    with open('frontend/data/courses.js', 'w', encoding='utf-8') as f:
        f.write("".join(out))
    print("Done")

if __name__ == '__main__':
    process_file()
