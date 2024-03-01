import React from "react";
import { styled } from "@mui/material/styles";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const gridData = [
	{
		Name: 'Sound Clash',
		Holder: 'Leo Nesskau',
		HolderAvatar: '/assets/holders/LeoNesskau.png',
		NFT: '/assets/Ddawgshift.gif',
		Price: '0.01 ETH'
	},
	{
		Name: 'Barman Ronan',
		Holder: 'Mirabel Starling',
		HolderAvatar: '/assets/holders/MirabelStarling.jpg',
		NFT: '/assets/Ddawgsneon.gif',
		Price: '0.01 ETH'
	}
];

export default function BasicGrid() {
    return (
        <div className="flex-1 p-8 rounded-md shadow shadow-black/60 drop-shadow-xl">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {
                        gridData.map((item, index) => (
                            <Grid item md={6} sx={12} key={index}>
                                <Item>
                                    <Box>
                                        <img src={item.NFT} alt={item.Holder} />
                                    </Box>
                                </Item>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </div>
    );
  }