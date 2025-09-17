import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const style = {
    py: 0,
    width: 'fit-content',
    maxWidth: 400,
    borderRadius: 5,
    border: '3px solid',
    borderColor: '#F7374F',
    backgroundColor: 'black',
    color: 'white',

};

export default function DividerVariants({uid, name, email}) {
    return (
        <div className = "userStats">
            <List sx={style} >
                <ListItem>
                    <ListItemText primary= {"User name: " + name} />
                </ListItem>
                <Divider variant="middle" component="li" sx={{ bgcolor: "#F7374F" }}/>
                <ListItem>
                    <ListItemText primary={"User ID: " + uid} />
                </ListItem>
                <Divider variant="middle" component="li" sx={{ bgcolor: "#F7374F" }}/>
                <ListItem>
                    <ListItemText primary={"User name: " + email} />
                </ListItem>
                <Divider variant="middle" component="li" sx={{ bgcolor: "#F7374F" }}/>
                <ListItem>
                    <ListItemText primary="Highest test score: TBA" />
                </ListItem>
            </List>
        </div>
    );
}
