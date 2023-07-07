import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

const NoteList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.gyanibooks.com/library/get_dummy_notes')
      .then((response) => setNotes(response.data))
      .catch((error) => console.error('Error fetching notes:', error));
  }, []);

  const parseNotesContent = (notes) => {
    try {
      const parsedContent = JSON.parse(notes);
      if (parsedContent && parsedContent.content) {
        const content = parsedContent.content;
        const extractedContent = [];
        content.forEach((blockGroup) => {
          if (blockGroup.content) {
            blockGroup.content.forEach((blockContainer) => {
              if (blockContainer.content) {
                blockContainer.content.forEach((block) => {
                  if (block.content && block.content[0]?.text) {
                    const textColor = block.attrs?.textColor || 'default';
                    const backgroundColor = block.attrs?.backgroundColor || 'default';
                    extractedContent.push({
                      text: block.content[0].text,
                      textColor,
                      backgroundColor,
                    });
                  }
                });
              }
            });
          }
        });
        return extractedContent;
      }
    } catch (error) {
      console.error('Error parsing notes content:', error);
    }
    return null;
  };

  return (
    <>
      <div >
        {notes.map((note) => (
          <div key={note.id}>
            <Card style={{ backgroundColor: "" }} >
              <CardContent>
                <Typography variant="h5" component="div">
                  ID: {note.id}
                </Typography>
                <Typography variant="h6" component="div">
                  User: {note.user}
                </Typography>
                <Typography variant="h6" component="div">
                  Title: {note.title}
                </Typography>
                <Typography variant="body1" component="div">
                  Category: {note.category}
                </Typography>
                <Typography variant="body1" component="div">
                  Notes:
                  <div>
                    {parseNotesContent(note.notes)?.map((line, index) => (
                      <div
                        key={index}
                        style={{
                          color: line.textColor !== 'default' ? line.textColor : undefined,
                          backgroundColor: line.backgroundColor !== 'default' ? line.backgroundColor : undefined,
                        }}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default NoteList;
